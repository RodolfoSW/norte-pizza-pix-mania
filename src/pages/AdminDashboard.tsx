import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Filter,
  History,
  Users,
  Trophy
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

interface CustomerStats {
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [customerStats, setCustomerStats] = useState<CustomerStats[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    loadOrders();
    loadCustomerStats();
  }, [navigate]);

  useEffect(() => {
    filterOrders();
    filterHistoryOrders();
    filterCustomerStats();
  }, [orders, searchTerm, statusFilter, historySearch, customerStats, customerSearch]);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('pizzaOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Filtrar apenas pedidos de hoje para o dashboard principal
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = parsedOrders.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
      setOrders(todayOrders);
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

  const filterHistoryOrders = () => {
    const savedOrders = localStorage.getItem('pizzaOrders');
    if (!savedOrders) return;

    const parsedOrders = JSON.parse(savedOrders);
    
    // Filtrar pedidos do dia anterior que estão com status "paid"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    let historyFiltered = parsedOrders.filter((order: Order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= yesterday && 
             orderDate <= yesterdayEnd && 
             order.status === 'paid';
    });

    // Aplicar filtro de busca no histórico
    if (historySearch) {
      historyFiltered = historyFiltered.filter((order: Order) => 
        order.customer.name.toLowerCase().includes(historySearch.toLowerCase()) ||
        order.customer.phone.includes(historySearch) ||
        order.id.includes(historySearch)
      );
    }

    setHistoryOrders(historyFiltered);
  };

  const loadCustomerStats = () => {
    const savedOrders = localStorage.getItem('pizzaOrders');
    if (!savedOrders) return;

    const parsedOrders = JSON.parse(savedOrders);
    const customerMap = new Map<string, CustomerStats>();

    // Processar todos os pedidos para criar estatísticas dos clientes
    parsedOrders.forEach((order: Order) => {
      const phone = order.customer.phone;
      
      if (customerMap.has(phone)) {
        const existing = customerMap.get(phone)!;
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        
        // Atualizar último pedido se for mais recente
        if (new Date(order.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = order.createdAt;
          existing.name = order.customer.name; // Atualizar nome mais recente
        }
      } else {
        customerMap.set(phone, {
          phone,
          name: order.customer.name,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrder: order.createdAt
        });
      }
    });

    // Converter para array e ordenar por total gasto (melhores clientes primeiro)
    const statsArray = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent);

    setCustomerStats(statsArray);
  };

  const filterCustomerStats = () => {
    if (!customerSearch) return customerStats;
    
    return customerStats.filter(customer =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch)
    );
  };

  const filteredCustomerStats = filterCustomerStats();

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
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Card>
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
                <CardTitle>Pedidos de Hoje ({filteredOrders.length})</CardTitle>
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
                                disabled={order.status === 'paid'}
                              >
                                <SelectTrigger className={`w-32 ${order.status === 'paid' ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Histórico Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Pagos (Ontem)</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{historyOrders.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita (Ontem)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {historyOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {historyOrders.length > 0 ? (historyOrders.reduce((sum, order) => sum + order.total, 0) / historyOrders.length).toFixed(2) : '0.00'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Histórico Search */}
            <Card>
              <CardHeader>
                <CardTitle>Buscar no Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome, telefone ou ID do pedido..."
                    className="pl-10"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Histórico Table */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pedidos Pagos ({historyOrders.length})</CardTitle>
                <CardDescription>
                  Pedidos pagos do dia anterior
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
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyOrders.map((order) => (
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
                          <TableCell className="text-xs">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                            <br />
                            {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                          </TableCell>
                          <TableCell>
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
                                    Informações completas do pedido (Histórico)
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {historyOrders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum pedido pago encontrado no histórico</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerStats.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Melhor Cliente</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">
                    {customerStats.length > 0 ? customerStats[0].name : 'Nenhum'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {customerStats.length > 0 ? `R$ ${customerStats[0].totalSpent.toFixed(2)}` : ''}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {customerStats.length > 0 ? 
                      (customerStats.reduce((sum, c) => sum + c.totalSpent, 0) / 
                       customerStats.reduce((sum, c) => sum + c.totalOrders, 0)).toFixed(2) 
                      : '0.00'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cliente Mais Fiel</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">
                    {customerStats.length > 0 ? 
                      customerStats.reduce((max, c) => c.totalOrders > max.totalOrders ? c : max, customerStats[0]).name 
                      : 'Nenhum'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {customerStats.length > 0 ? 
                      `${customerStats.reduce((max, c) => c.totalOrders > max.totalOrders ? c : max, customerStats[0]).totalOrders} pedidos`
                      : ''}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Search */}
            <Card>
              <CardHeader>
                <CardTitle>Buscar Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou telefone..."
                    className="pl-10"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Ranking Table */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Clientes ({filteredCustomerStats.length})</CardTitle>
                <CardDescription>
                  Histórico completo de clientes ordenado por valor total gasto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Posição</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Total de Pedidos</TableHead>
                        <TableHead>Valor Total Gasto</TableHead>
                        <TableHead>Valor Médio por Pedido</TableHead>
                        <TableHead>Último Pedido</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomerStats.map((customer, index) => (
                        <TableRow key={customer.phone}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {index === 0 && <Trophy className="w-4 h-4 mr-1 text-yellow-500" />}
                              {index === 1 && <Trophy className="w-4 h-4 mr-1 text-gray-400" />}
                              {index === 2 && <Trophy className="w-4 h-4 mr-1 text-orange-400" />}
                              #{index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {customer.totalOrders} pedido{customer.totalOrders !== 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            R$ {customer.totalSpent.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            R$ {(customer.totalSpent / customer.totalOrders).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {new Date(customer.lastOrder).toLocaleDateString('pt-BR')}
                            <br />
                            {new Date(customer.lastOrder).toLocaleTimeString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredCustomerStats.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum cliente encontrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;