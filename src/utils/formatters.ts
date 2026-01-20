export const formatCurrency = (amount: number, currency = 'XOF') => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-SN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
