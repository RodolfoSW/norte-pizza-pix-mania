import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin/dashboard');
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Usuário ou senha incorretos",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Área Administrativa</CardTitle>
          <CardDescription>
            Faça login para acessar o painel de controle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  className="pl-10"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="pl-10"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Credenciais padrão:</p>
            <p>Usuário: admin | Senha: admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;