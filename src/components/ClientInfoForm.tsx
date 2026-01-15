/**
 * FORMULARIO DE INFORMACIÓN DEL CLIENTE
 * Modal para collects datos del cliente antes de generar pedido
 * Maneja el flujo: Formulario → Descargar PDF → WhatsApp
 */

import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, MessageSquare, X, Check, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientInfo } from '@/utils/orderGenerator';

interface ClientInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientInfo: ClientInfo) => void;
  isGenerating: boolean;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating
}) => {
  const [formData, setFormData] = useState<ClientInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientInfo, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{8,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Ingresa un teléfono válido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ClientInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-full max-w-md bg-background z-50 rounded-xl shadow-2xl
                      animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Confirmar Pedido</h2>
              <p className="text-xs text-muted-foreground">Completa tus datos para continuar</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isGenerating}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <User className="w-4 h-4 text-muted-foreground" />
              Nombre completo *
            </label>
            <Input
              placeholder="Ej: Juan Pérez"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
              disabled={isGenerating}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Teléfono (WhatsApp) *
            </label>
            <Input
              placeholder="Ej: 70123456"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={errors.phone ? 'border-destructive' : ''}
              disabled={isGenerating}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email (opcional)
            </label>
            <Input
              type="email"
              placeholder="Ej: juan@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
              disabled={isGenerating}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Dirección de entrega (opcional)
            </label>
            <Input
              placeholder="Ej: Av. Arce #1234, La Paz"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Notas */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Notas adicionales (opcional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-input rounded-lg text-sm 
                         bg-background resize-none focus:outline-none focus:ring-2 
                         focus:ring-primary disabled:opacity-50"
              placeholder="Ej: Necesito entrega para el viernes..."
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Info - Explicación del proceso */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Proceso de pedido:</p>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-3 h-3 text-primary" />
              </div>
              <span className="text-muted-foreground">Se descargará el PDF con los detalles</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-muted-foreground">Luego abriremos WhatsApp con el mensaje listo</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Confirmar Pedido
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ClientInfoForm;
