// import React, { useState } from 'react';
// import { TextField, Button, Card, CardContent, Typography, Alert } from '@mui/material';
// import { LogIn, UserPlus } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8000/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         navigate('/');
//       } else {
//         setError(data.error || 'Login failed');
//       }
//     } catch (error) {
//       setError('An error occurred during login');
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card className="max-w-md mx-auto shadow-lg">
//         <CardContent className="p-6">
//           <Typography variant="h4" className="mb-6 text-center font-bold flex items-center justify-center">
//             <LogIn className="mr-2" />
//             Login
//           </Typography>
          
//           {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <TextField
//               fullWidth
//               label="Email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({...formData, password: e.target.value})}
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               className="bg-indigo-600 hover:bg-indigo-700"
//             >
//               Login
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export const Register = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     name: '',
//     password: '',
//     password2: '',
//     phn: ''
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8000/register/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
//       if (response.ok) {
//         navigate('/login');
//       } else {
//         setError(data.error || 'Registration failed');
//       }
//     } catch (error) {
//       setError('An error occurred during registration');
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card className="max-w-md mx-auto shadow-lg">
//         <CardContent className="p-6">
//           <Typography variant="h4" className="mb-6 text-center font-bold flex items-center justify-center">
//             <UserPlus className="mr-2" />
//             Register
//           </Typography>
          
//           {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <TextField
//               fullWidth
//               label="Email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//             <TextField
//               fullWidth
//               label="Name"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//             <TextField
//               fullWidth
//               label="Phone Number"
//               value={formData.phn}
//               onChange={(e) => setFormData({...formData, phn: e.target.value})}
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({...formData, password: e.target.value})}
//             />
//             <TextField
//               fullWidth
//               label="Confirm Password"
//               type="password"
//               value={formData.password2}
//               onChange={(e) => setFormData({...formData, password2: e.target.value})}
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               className="bg-indigo-600 hover:bg-indigo-700"
//             >
//               Register
//             </Button>
//           </form>
//         </Car