import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  auth, 
  sendPasswordReset 
} from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css'; // Reusing the same CSS as Login
import { 
  Button, 
  TextField, 
  Alert
} from '@mui/material';

const Reset = () => {
  const [user, loading] = useAuthState(auth);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      // If user is already logged in, redirect to user dashboard
      navigate('/user');
    }
  }, [user, loading, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const { email } = values;
      setError('');
      try {
        await sendPasswordReset(email);
        setResetSent(true);
      } catch (err) {
        setError(err.message);
      }
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    }),
  });

  if (resetSent) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Password Reset</h2>
          <Alert severity="success" sx={{ mb: 3 }}>
            Password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.
          </Alert>
          <div className="link" style={{ textAlign: 'center' }}>
            <Link to="/login" className="switch_link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Reset Password</h2>
        <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <TextField
              fullWidth
              variant="outlined"
              label="Email Address"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              autoFocus
            />
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
            disabled={loading || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <div className="link" style={{ marginTop: '20px', textAlign: 'center' }}>
            Remember your password?{" "}
            <Link to="/login" className="switch_link">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reset;
