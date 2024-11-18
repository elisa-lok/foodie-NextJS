export const PaymentStatusShow = (status) => {
  switch (status) {
    case 0:
      return 'unpaid';
    
    case 1:
      return 'paid';
  }
}

export const PaymentMethodShow = (status) => {
  switch (status) {
    case 0:
      return 'pending';
    
    case 1:
      return 'processing';
    
    case 2:
      return 'completed';
    
    
  }
}