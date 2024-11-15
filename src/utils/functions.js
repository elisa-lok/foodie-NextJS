export const PaymentStatusShow = (status) => {
  switch (status) {
    case 0:
      return 'unpaid';
    
    case 1:
      return 'paid';
  }
}