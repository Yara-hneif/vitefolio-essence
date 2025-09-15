import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/form/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/data-display/card';
import { Separator } from '@/components/ui/data-display/separator';
import { Loader2, Mail, Lock, ArrowLeft, Github, Eye, EyeOff } from 'lucide-react';
import ResendConfirmation from '@/components/auth/ResendConfirmation';
import ResetPasswordLink from '@/components/auth/ResetPasswordLink';
import LoginMagicLink from '@/components/auth/LoginMagicLink';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, authWithProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.status === 'complete') {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else if (result.status === 'needs_verification') {
      toast.info(
        <div>
          Please verify your email to complete login.
          <ResendConfirmation email={email} />
        </div>
      );
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      await authWithProvider(provider);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 hover-lift"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
              VP
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to access your portfolio</p>
        </div>

        <Card className="glass shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Choose your preferred login method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 hover-lift transition-all duration-300"
                onClick={() => handleSocialLogin('google')}
              >
                <Mail className="h-5 w-5 mr-3 text-red-500" />
                <span className="font-medium">Continue with Gmail</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 hover-lift transition-all duration-300"
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="h-5 w-5 mr-3" />
                <span className="font-medium">Continue with GitHub</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 hover-lift transition-all duration-300"
                onClick={() => handleSocialLogin('facebook')}
              >
                <div className="w-5 h-5 mr-3 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold">
                  f
                </div>
                <span className="font-medium">Continue with Facebook</span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password + Magic link */}
              <div className="flex flex-col gap-2 text-center">
                <ResetPasswordLink email={email} />
                <LoginMagicLink email={email} />
              </div>

              <Button
                type="submit"
                className="w-full h-12 hover-lift transition-all duration-300"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create New Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
