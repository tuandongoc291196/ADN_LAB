import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  auth, 
  logInWithEmailAndPassword, 
  signInWithGoogle 
} from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css';
import { 
  Button, 
  TextField, 
  Divider, 
  IconButton, 
  InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleButton from 'react-google-button';

const Login = ({ setUser }) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      // Set the user in the parent component
      setUser({
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email,
        role: 'user' // Default role, could be fetched from Firebase if needed
      });
      
      // Determine redirect based on user role
      // This could be enhanced to check the role from Firestore
      navigate('/user');
    }
  }, [user, loading, navigate, setUser]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const { email, password } = values;
      await logInWithEmailAndPassword(email, password);
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Required")
        .email("Email invalid"),
      password: Yup.string().required("Required"),
    }),
  });

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{mb: 0}}
            />
            <div className="link" style={{textAlign: "right"}}>
              <Link to="/reset" className="switch_link">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(45deg, #aaa 30%, #434343 90%)",
              border: 0,
              borderRadius: 15,
              boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
              color: "white",
              height: 48,
              padding: "0 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #434343 30%, #aaa 90%)",
              },
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Login'}
          </Button>
          <Divider sx={{mt: 3, color: "grey"}}> or </Divider>
          <div className="login__google-container">
            <GoogleButton onClick={signInWithGoogle} />
          </div>
          <div className="link">
            Do not have an account?{" "}
            <Link to="/register" className="switch_link">
              Register
            </Link>{" "}
            now.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 