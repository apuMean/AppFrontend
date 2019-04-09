import createNumberMask from 'text-mask-addons/dist/createNumberMask';

// Tax rate Mask
export const taxRateMask = createNumberMask({
	prefix: '',
	suffix: '',
	includeThousandsSeparator: false,
	allowDecimal: true,
	decimalLimit: 2,
	integerLimit: 100
});

// Value Mask
export const valueMask = createNumberMask({
	prefix: '$',
	suffix: '',
	includeThousandsSeparator: true,
	allowDecimal: true,
	decimalLimit: 2,
	integerLimit: 100
});

export const priceMask = createNumberMask({
	prefix: '$',
	suffix: '',
	includeThousandsSeparator: true,
	allowDecimal: true,
	decimalLimit: 2,
	integerLimit: 15
});

// Tax rate Mask
export const markUpMask = createNumberMask({
	prefix: '',
	suffix: '',
	includeThousandsSeparator: false,
	allowDecimal: true,
	decimalLimit: 2,
	integerLimit: 100,
	// allowNegative:true
});
