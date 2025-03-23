
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SignUpForm from '../components/auth/SignUpForm';
import AnimatedSection from '../components/ui-custom/AnimatedSection';

const SignUp: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <AnimatedSection animation="fade-in-up">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-2">Join the Community</h1>
            <p className="text-muted-foreground mb-8">
              Create an account to connect with others and share your work.
            </p>
            <SignUpForm />
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default SignUp;
