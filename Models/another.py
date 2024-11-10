import pandas as pd 
import numpy as np 
import seaborn as sns 
import plotly.express as px 
import matplotlib.pyplot as plt 
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import cudf  # GPU-accelerated DataFrame library
import cupy as cp  # GPU-accelerated NumPy alternative
from cuml import RandomForestRegressor  # GPU version of Random Forest
from cuml.preprocessing import StandardScaler  # GPU version of scaler
import xgboost as xgb  # XGBoost has built-in GPU support

# Load data using cuDF for GPU acceleration
clean_df = cudf.read_csv('/kaggle/input/flight-price-prediction/Clean_Dataset.csv')

# Remove outliers
clean_df = clean_df[clean_df.price <= 100000]

# Define input and target columns
inputs_cols = ['airline', 'source_city', 'departure_time', 'stops', 'arrival_time',
               'destination_city', 'class', 'duration', 'days_left']
targets_col = 'price'

inputs_dataset = clean_df[inputs_cols].copy()
targets_set = clean_df[targets_col].copy()

# Identify numeric and categorical columns
numeric_cols = inputs_dataset.select_dtypes(include=[np.number]).columns.tolist()
categorical_cols = inputs_dataset.select_dtypes(include=['object']).columns.tolist()

# Scale numeric features using GPU-accelerated scaler
scaler = StandardScaler()
inputs_dataset[numeric_cols] = scaler.fit_transform(inputs_dataset[numeric_cols])

# Encode categorical features
# Note: We'll use CPU OneHotEncoder since cuML doesn't have it yet
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
categorical_data = inputs_dataset[categorical_cols].to_pandas()  # Temporarily move to CPU
encoded_data = encoder.fit_transform(categorical_data)
encoder_cols = encoder.get_feature_names_out(categorical_cols)

# Combine features
X = cudf.concat([
    inputs_dataset[numeric_cols],
    cudf.DataFrame(encoded_data, columns=encoder_cols)
], axis=1)
y = targets_set

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

# Train GPU-accelerated Random Forest
rf_params = {
    'n_estimators': 100,
    'max_depth': 16,
    'random_state': 42
}
gpu_rf = RandomForestRegressor(**rf_params)
gpu_rf.fit(X_train, y_train)

# Make predictions
test_preds = gpu_rf.predict(X_test)
print(f"R2 Score on GPU: {r2_score(y_test, test_preds)}")

# Function for single prediction
def make_prediction(single_input):
    new_df = pd.DataFrame([single_input])
    
    # Scale numeric features
    new_df[numeric_cols] = scaler.transform(new_df[numeric_cols])
    
    # Encode categorical features
    encoded_cats = encoder.transform(new_df[categorical_cols])
    new_df_encoded = pd.DataFrame(encoded_cats, columns=encoder_cols)
    
    # Combine features
    X = cudf.from_pandas(pd.concat([
        new_df[numeric_cols],
        new_df_encoded
    ], axis=1))
    
    # Make prediction
    pred = gpu_rf.predict(X)
    return pred[0]

# Save model
import joblib
model_elements = {
    'model': gpu_rf,
    'scaler': scaler,
    'encoder': encoder,
    'input_cols': inputs_cols,
    'target_col': targets_col,
    'numeric_cols': numeric_cols,
    'categorical_cols': categorical_cols,
    'encoded_cols': encoder_cols
}
joblib.dump(model_elements, "Flight_ticket_model_gpu.joblib")