import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Search, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck,
  Eye,
  Filter
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    deliveryType: 'delivery' | 'pickup';
    cep?: string;
    address?: string;
    number?: string;
    complement?: string;
    reference?: string;
  };
  items: OrderItem[];
  paymentMethod: 'pix' | 'money' | 'card';
  total: number;
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    loadOrders();
  }, [navigate]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('pizzaOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrders(parsedOrders);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm) ||
        order.id.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('pizzaOrders', JSON.stringify(updatedOrders));
    
    toast({
      title: "Status atualizado!",
      description: `Pedido marcado como ${getStatusLabel(newStatus)}`,
    });
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'Pendente',
      paid: 'Pago',
      preparing: 'Preparando',
      ready: 'Pronto',
      delivered: 'Entregue'
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      pix: 'PIX',
      money: 'Dinheiro',
      card: 'Cartão'
    };
    return labels[method] || method;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo",
    });
  };

  const totalRevenue = orders
    .filter(order => order.status === 'paid' || order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalOrders > 0 ? ((orders.filter(o => o.status === 'delivered').length / totalOrders) * 100).toFixed(1) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, telefone ou ID do pedido..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="preparing">Preparando</SelectItem>
                  <SelectItem value="ready">Pronto</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
            <CardDescription>
              Gerencie todos os pedidos do restaurante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{order.customer.name}</TableCell>
                      <TableCell>{order.customer.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {order.customer.deliveryType === 'delivery' ? (
                            <Truck className="w-4 h-4 mr-1" />
                          ) : (
                            <Package className="w-4 h-4 mr-1" />
                          )}
                          {order.customer.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentMethodLabel(order.paymentMethod)}</TableCell>
                      <TableCell className="font-medium">R$ {order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        <br />
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Pedido #{order.id.substring(0, 8)}</DialogTitle>
                                <DialogDescription>
                                  Informações completas do pedido
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Informações do Cliente</h4>
                                    <p><strong>Nome:</strong> {order.customer.name}</p>
                                    <p><strong>Telefone:</strong> {order.customer.phone}</p>
                                    <p><strong>Tipo:</strong> {order.customer.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}</p>
                                    {order.customer.deliveryType === 'delivery' && (
                                      <>
                                        <p><strong>CEP:</strong> {order.customer.cep}</p>
                                        <p><strong>Endereço:</strong> {order.customer.address}</p>
                                        <p><strong>Número:</strong> {order.customer.number}</p>
                                        {order.customer.complement && <p><strong>Complemento:</strong> {order.customer.complement}</p>}
                                        {order.customer.reference && <p><strong>Referência:</strong> {order.customer.reference}</p>}
                                      </>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Informações do Pedido</h4>
                                    <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                                    <p><strong>Pagamento:</strong> {getPaymentMethodLabel(order.paymentMethod)}</p>
                                    <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
                                    <p><strong>Status:</strong> {getStatusLabel(order.status)}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                        <div>
                                          <span className="font-medium">{item.name}</span>
                                          <span className="text-muted-foreground ml-2">({item.size})</span>
                                        </div>
                                        <div className="text-right">
                                          <div>{item.quantity}x R$ {item.price.toFixed(2)}</div>
                                          <div className="font-medium">R$ {(item.quantity * item.price).toFixed(2)}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Select
                            value={order.status}
                            onValueChange={(value: Order['status']) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="paid">Pago</SelectItem>
                              <SelectItem value="preparing">Preparando</SelectItem>
                              <SelectItem value="ready">Pronto</SelectItem>
                              <SelectItem value="delivered">Entregue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum pedido encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;