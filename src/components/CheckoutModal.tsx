
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CartItem, Customer } from '../types/pizza';
import { useToast } from '@/hooks/use-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onConfirmOrder: (customer: Customer) => void;
}

const CheckoutModal = ({ isOpen, onClose, items, onConfirmOrder }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    address: '',
    deliveryType: 'delivery',
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    number: '',
    reference: ''
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = customer.deliveryType === 'delivery' ? 7 : 0;
  const grandTotal = total + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isDelivery = customer.deliveryType === 'delivery';
    const missingFields = !customer.name || !customer.phone || 
      (isDelivery && (!customer.cep || !customer.number));
    
    if (missingFields) {
      toast({
        title: "Dados incompletos",
        description: isDelivery 
          ? "Por favor, preencha nome, telefone, CEP e número da casa." 
          : "Por favor, preencha nome e telefone.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(customer.phone)) {
      toast({
        title: "Telefone inválido",
        description: "Use o formato (85) 99999-9999",
        variant: "destructive"
      });
      return;
    }

    if (customer.deliveryType === 'delivery' && !customer.address.toLowerCase().includes('macapá') && !customer.address.toLowerCase().includes('macapa')) {
      toast({
        title: "Área de entrega limitada",
        description: "Realizamos entregas apenas em Macapá-AP",
        variant: "destructive"
      });
      return;
    }

    onConfirmOrder(customer);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const searchCep = async (cep: string) => {
    if (cep.length !== 9) return;
    
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        if (data.localidade.toLowerCase() !== 'macapá' || data.uf !== 'AP') {
          toast({
            title: "CEP não permitido",
            description: "Este CEP não é de Macapá-AP. Realizamos entregas apenas em Macapá.",
            variant: "destructive"
          });
          setCustomer(prev => ({...prev, cep: ''}));
          return;
        }
        
        setCustomer(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          address: `${data.logradouro}, ${data.bairro}, ${data.localidade}-${data.uf}`
        }));
        
        toast({
          title: "CEP encontrado!",
          description: "Endereço preenchido automaticamente",
        });
      } else {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-800">Finalizar Pedido</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.pizza.name}</p>
                      <p className="text-gray-500">{item.size} - Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  {customer.deliveryType === 'delivery' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Taxa de entrega:</span>
                      <span>R$ 7,00</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-800">R$ {grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    💳 Pagamento: PIX
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={customer.name}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">WhatsApp *</Label>
                <Input
                  id="phone"
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: formatPhone(e.target.value)})}
                  placeholder="(85) 99999-9999"
                  maxLength={15}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Seu pedido será enviado para este número
                </p>
              </div>

              <div>
                <Label>Tipo de Entrega *</Label>
                <RadioGroup
                  value={customer.deliveryType}
                  onValueChange={(value: 'delivery' | 'pickup') => 
                    setCustomer({...customer, deliveryType: value})
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Entrega em casa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Retirar no estabelecimento</Label>
                  </div>
                </RadioGroup>
              </div>

              {customer.deliveryType === 'delivery' ? (
                <>
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={customer.cep || ''}
                      onChange={(e) => {
                        const formatted = formatCep(e.target.value);
                        setCustomer({...customer, cep: formatted});
                        if (formatted.length === 9) {
                          searchCep(formatted);
                        }
                      }}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                      disabled={loadingCep}
                    />
                    {loadingCep && (
                      <p className="text-xs text-blue-600 mt-1">
                        🔍 Buscando endereço...
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        value={customer.street || ''}
                        onChange={(e) => setCustomer({...customer, street: e.target.value})}
                        placeholder="Nome da rua"
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={customer.neighborhood || ''}
                        onChange={(e) => setCustomer({...customer, neighborhood: e.target.value})}
                        placeholder="Nome do bairro"
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="number">Número da Casa *</Label>
                      <Input
                        id="number"
                        value={customer.number || ''}
                        onChange={(e) => setCustomer({...customer, number: e.target.value})}
                        placeholder="123"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference">Ponto de Referência</Label>
                      <Input
                        id="reference"
                        value={customer.reference || ''}
                        onChange={(e) => setCustomer({...customer, reference: e.target.value})}
                        placeholder="Próximo ao..."
                      />
                    </div>
                  </div>

                  <p className="text-xs text-amber-600">
                    ⚠️ Entregas disponíveis apenas em Macapá-AP
                  </p>
                </>
              ) : (
                <div>
                  <Label htmlFor="address">Observações (opcional)</Label>
                  <Textarea
                    id="address"
                    value={customer.address}
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                    placeholder="Observações sobre a retirada..."
                    rows={3}
                  />
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Como funciona:</h4>
                <ol className="text-sm text-green-700 space-y-1">
                  <li>1. Confirme seus dados</li>
                  <li>2. Você será redirecionado para o WhatsApp</li>
                  <li>3. Enviaremos os dados do PIX</li>
                  <li>4. Após confirmação do pagamento, preparamos sua pizza!</li>
                </ol>
              </div>

              <Button 
                type="submit" 
                className="w-full pizza-gradient hover:opacity-90"
                size="lg"
              >
                Enviar Pedido via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
