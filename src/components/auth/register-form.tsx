"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Lock, Mail, User, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const registerSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters / El nombre debe tener al menos 2 caracteres' })
    .max(50, { message: 'Name must be less than 50 characters / El nombre debe tener menos de 50 caracteres' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address / Por favor ingrese un email válido' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters / La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter / La contraseña debe contener al menos una mayúscula' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter / La contraseña debe contener al menos una minúscula' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number / La contraseña debe contener al menos un número' }),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'user']).optional().default('user'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions / Debe aceptar los términos y condiciones'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match / Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (userData: any) => void;
  showRoleSelect?: boolean;
}

export const RegisterForm = ({ 
  onSwitchToLogin, 
  onRegisterSuccess, 
  showRoleSelect = false 
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
      acceptTerms: false
    },
    mode: 'onBlur'
  });

  const password = watch('password');

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score < 2) return { score, label: 'Weak / Débil', color: 'bg-red-500' };
    if (score < 4) return { score, label: 'Medium / Medio', color: 'bg-yellow-500' };
    return { score, label: 'Strong / Fuerte', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password || '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password,
          role: data.role
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = 'Registration failed / Registro fallido';
        
        switch (result.code) {
          case 'EMAIL_EXISTS':
            errorMessage = 'Email already exists / El email ya existe';
            break;
          case 'INVALID_EMAIL_FORMAT':
            errorMessage = 'Invalid email format / Formato de email inválido';
            break;
          case 'MISSING_EMAIL':
            errorMessage = 'Email is required / El email es requerido';
            break;
          case 'MISSING_PASSWORD':
            errorMessage = 'Password is required / La contraseña es requerida';
            break;
          case 'MISSING_NAME':
            errorMessage = 'Name is required / El nombre es requerido';
            break;
          case 'INVALID_ROLE':
            errorMessage = 'Invalid role selected / Rol inválido seleccionado';
            break;
          default:
            errorMessage = result.error || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Auto-login after successful registration
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password
        }),
      });

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        localStorage.setItem('authToken', loginResult.token);
        
        toast.success('¡Registration successful! Welcome to GC3 Consultoría / ¡Registro exitoso! Bienvenido a GC3 Consultoría', {
          duration: 5000,
          description: 'Your account has been created and you are now logged in / Tu cuenta ha sido creada y ahora estás conectado'
        });

        onRegisterSuccess(loginResult.user);
      } else {
        toast.success('Registration successful! Please log in / ¡Registro exitoso! Por favor inicia sesión', {
          duration: 5000,
        });
        onSwitchToLogin();
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again / Registro fallido. Por favor intente nuevamente', {
        duration: 5000,
        description: 'Please check your information and try again / Por favor verifique su información e intente nuevamente'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#1E5F99] mb-2">
          Create Account
        </CardTitle>
        <CardDescription className="text-[#4A4A4A] text-base">
          Join GC3 Consultoría / Únete a GC3 Consultoría
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[#4A4A4A] flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name / Nombre Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name / Ingrese su nombre completo"
              className={`h-12 border-2 transition-all duration-200 ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-[#ddd] focus:border-[#1E5F99]'
              }`}
              {...register('name')}
              disabled={isLoading}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#4A4A4A] flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address / Dirección de Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email / Ingrese su email"
              className={`h-12 border-2 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-[#ddd] focus:border-[#1E5F99]'
              }`}
              {...register('email')}
              disabled={isLoading}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#4A4A4A] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password / Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password / Cree una contraseña fuerte"
                className={`h-12 border-2 pr-12 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#ddd] focus:border-[#1E5F99]'
                }`}
                {...register('password')}
                disabled={isLoading}
                aria-describedby={errors.password ? 'password-error' : 'password-strength'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B5B5B5] hover:text-[#4A4A4A] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div id="password-strength" className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#4A4A4A]">
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#4A4A4A] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirm Password / Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password / Confirme su contraseña"
                className={`h-12 border-2 pr-12 transition-all duration-200 ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#ddd] focus:border-[#1E5F99]'
                }`}
                {...register('confirmPassword')}
                disabled={isLoading}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B5B5B5] hover:text-[#4A4A4A] transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role Select (Hidden by default) */}
          {showRoleSelect && (
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-[#4A4A4A] flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Role / Rol
              </Label>
              <Select
                value={watch('role')}
                onValueChange={(value) => {
                  setValue('role', value as 'admin' | 'user');
                  trigger('role');
                }}
                disabled={isLoading}
              >
                <SelectTrigger className={`h-12 border-2 transition-all duration-200 ${
                  errors.role 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#ddd] focus:border-[#1E5F99]'
                }`}>
                  <SelectValue placeholder="Select your role / Seleccione su rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User / Usuario</SelectItem>
                  <SelectItem value="admin">Administrator / Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role.message}
                </p>
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptTerms"
                checked={watch('acceptTerms')}
                onCheckedChange={(checked) => {
                  setValue('acceptTerms', checked as boolean);
                  trigger('acceptTerms');
                }}
                disabled={isLoading}
                className={`mt-1 ${
                  errors.acceptTerms ? 'border-red-500' : 'border-[#ddd]'
                }`}
                aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
              />
              <Label htmlFor="acceptTerms" className="text-sm text-[#4A4A4A] leading-relaxed cursor-pointer">
                I accept the{' '}
                <a href="/terms" className="text-[#1E5F99] hover:underline font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#1E5F99] hover:underline font-medium">
                  Privacy Policy
                </a>
                <br />
                <span className="text-[#B5B5B5]">
                  Acepto los{' '}
                  <a href="/terms" className="text-[#1E5F99] hover:underline font-medium">
                    Términos y Condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="/privacy" className="text-[#1E5F99] hover:underline font-medium">
                    Política de Privacidad
                  </a>
                </span>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p id="terms-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#1E5F99] hover:bg-[#164a7a] text-white font-semibold rounded-md transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account... / Creando Cuenta...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Create Account / Crear Cuenta
              </div>
            )}
          </Button>
        </form>

        {/* Switch to Login */}
        <div className="text-center pt-4 border-t border-[#F5F5F5]">
          <p className="text-[#4A4A4A] text-sm">
            Already have an account? / ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#1E5F99] hover:underline font-medium transition-colors"
              disabled={isLoading}
            >
              Sign In / Iniciar Sesión
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};