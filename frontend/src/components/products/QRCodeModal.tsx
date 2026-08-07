import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Product } from '../../types';
import { productApi } from '../../services/product.api';
import { QrCode, Download, Printer, X, Package, Tag, Building2, Layers } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, product }) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    if (isOpen && product) {
      setLoading(true);
      setQrUrl(null);

      productApi
        .getProductQrCodeBlob(product.id)
        .then((blob) => {
          if (isMounted) {
            objectUrl = URL.createObjectURL(blob);
            setQrUrl(objectUrl);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setLoading(false);
            toast.error('Unable to generate QR Code');
          }
        });
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isOpen, product]);

  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleDownload = () => {
    if (!qrUrl) {
      toast.error('Unable to generate QR Code');
      return;
    }
    const filename = `${product.sku || 'product'}-qrcode.png`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${filename}`);
  };

  const handlePrint = () => {
    if (!qrUrl) {
      toast.error('Unable to generate QR Code');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Print popup was blocked. Please allow popups.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Label - ${product.sku}</title>
          <style>
            @page {
              size: A6 auto;
              margin: 10mm;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              color: #0f172a;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: #ffffff;
            }
            .label-card {
              border: 2px solid #0284c7;
              border-radius: 16px;
              padding: 24px;
              width: 100%;
              max-width: 320px;
              text-align: center;
              box-sizing: border-box;
            }
            .company {
              font-size: 14px;
              font-weight: 800;
              letter-spacing: 0.05em;
              color: #0284c7;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .system {
              font-size: 10px;
              font-weight: 600;
              color: #64748b;
              margin-bottom: 16px;
              text-transform: uppercase;
              letter-spacing: 0.02em;
            }
            .qr-box {
              background: #ffffff;
              padding: 12px;
              border-radius: 12px;
              display: inline-block;
              border: 1px solid #e2e8f0;
              margin-bottom: 16px;
            }
            .qr-box img {
              width: 180px;
              height: 180px;
              display: block;
            }
            .product-name {
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
              margin: 0 0 6px 0;
            }
            .sku-badge {
              display: inline-block;
              background: #f0f9ff;
              color: #0369a1;
              font-family: monospace;
              font-weight: 700;
              font-size: 12px;
              padding: 4px 10px;
              border-radius: 6px;
              border: 1px solid #bae6fd;
              margin-bottom: 12px;
            }
            .details-grid {
              font-size: 11px;
              color: #475569;
              display: flex;
              justify-content: space-between;
              border-top: 1px dashed #cbd5e1;
              padding-top: 10px;
              margin-top: 6px;
            }
            .details-grid div {
              text-align: left;
            }
            .details-grid div:last-child {
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="company">IMS</div>
            <div class="system">Inventory Management System</div>
            <div class="qr-box">
              <img src="${qrUrl}" alt="Product QR Code" />
            </div>
            <h3 class="product-name">${product.productName}</h3>
            <div class="sku-badge">SKU: ${product.sku}</div>
            <div class="details-grid">
              <div><strong>Category:</strong> ${product.category?.name || 'N/A'}</div>
              <div><strong>Supplier:</strong> ${product.supplier?.name || 'N/A'}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          className="relative w-full max-w-md bg-white/90 dark:bg-[#121214]/95 backdrop-blur-2xl rounded-3xl border border-sky-100 dark:border-white/10 shadow-2xl overflow-hidden z-10"
        >
          {/* Header Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-sky-500 to-emerald-400" />

          {/* Modal Header */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center border border-sky-200/50 dark:border-sky-800/40">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 id="qr-modal-title" className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Product QR Label
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Scan for real-time inventory tracking
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close QR Modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 flex flex-col items-center">
            {/* QR Code Container */}
            <div className="relative w-56 h-56 rounded-2xl bg-slate-50 dark:bg-[#1A1A1E] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-3 shadow-inner">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-3 animate-pulse">
                  <div className="w-40 h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              ) : qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`QR code for ${product.productName}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center text-xs text-slate-400">
                  <QrCode className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <span>Unable to load QR</span>
                </div>
              )}
            </div>

            {/* Product Meta Card */}
            <div className="w-full space-y-3 bg-slate-50/70 dark:bg-[#161619] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Package className="h-3.5 w-3.5 text-sky-500" /> Product Name
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {product.productName}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Tag className="h-3.5 w-3.5 text-sky-500" /> SKU Identifier
                </span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200/50 dark:border-sky-900/40">
                  {product.sku}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Layers className="h-3.5 w-3.5 text-emerald-500" /> Category
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {product.category?.name || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Building2 className="h-3.5 w-3.5 text-emerald-500" /> Supplier
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {product.supplier?.name || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-6 pt-0 flex flex-wrap sm:flex-nowrap items-center justify-end gap-3">
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={Printer}
              onClick={handlePrint}
              disabled={loading || !qrUrl}
            >
              Print Label
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Download}
              onClick={handleDownload}
              disabled={loading || !qrUrl}
            >
              Download PNG
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
