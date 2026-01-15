import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolRegisterSchema } from '@/lib/validations';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useState } from 'react';

type RegisterForm = z.infer<typeof schoolRegisterSchema>;

export default function SchoolRegister() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schoolRegisterSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...rest } = data;
      if (!verificationFile) {
        setFileError('Verification document is required');
        return;
      }

      const formData = new FormData();
      formData.append('name', rest.name);
      formData.append('email', rest.email);
      formData.append('password', rest.password);
      formData.append('role', 'school');
      formData.append('organizationName', rest.organizationName);
      formData.append('phone', rest.phone);
      formData.append('address', rest.address);
      formData.append('verificationDocument', verificationFile);

      await register(formData);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light">
      {/* Navigation Bar */}
      <nav className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-20 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.jpeg" alt="EduConnect Logo" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xl font-bold text-foreground">EduConnect</span>
            </Link>
            <Link to="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-2xl shadow-large">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-secondary-light rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-secondary" />
          </div>
          <CardTitle className="text-3xl font-bold">School Registration</CardTitle>
          <CardDescription>Join EduConnect as a school</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Person Name</Label>
                <Input
                  id="name"
                  {...registerField('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerField('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationDocument">Verification Document (Image)</Label>
              <Input
                id="verificationDocument"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setVerificationFile(file);
                  setFileError(null);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Upload school registration or affiliation certificate (JPG/PNG, max 5MB).
              </p>
              {fileError && <p className="text-sm text-destructive">{fileError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationName">School Name</Label>
              <Input
                id="organizationName"
                {...registerField('organizationName')}
                className={errors.organizationName ? 'border-destructive' : ''}
              />
              {errors.organizationName && (
                <p className="text-sm text-destructive">{errors.organizationName.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...registerField('phone')}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerField('password')}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerField('confirmPassword')}
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">School Address</Label>
              <Textarea
                id="address"
                {...registerField('address')}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/register')} className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
