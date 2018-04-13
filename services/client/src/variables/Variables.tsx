const headerStyle = {
	paper: {
		display: 'inline-block',
		float: 'left' as 'left',
		margin: '0 32px 16px 32px',
		position: 'relative' as 'relative'
	},
	rightIcon: {
		textAlign: 'center',
		lineHeight: '24px'
	},
	divider: {
		marginTop: '0',
		marginBottom: '0'
	}
};

const ticketStyle = {
	card: {
		width: 290,
		position: 'relative' as 'relative',
		margin: '0 10px 20px 10px'
	},
	header: {
		paddingRight: 0
	},
	title: {
		marginTop: '10px',
		fontWeight: 'bold' as 'bold',
		fontSize: '14px'
	},
	subtitle: {
		fontSize: '12px'
	},
	text: {
		paddingTop: 0,
		paddingBottom: 0
	},
	actions: {
		paddingTop: 0
	}
};

const menuStyle = {
	menu: {
		width: '40%',
		fontSize: '12px',
		float: 'right' as 'right'
	},
	menuItem: {
		fontSize: '12px'
	},
	icon: {
		padding: 0,
		width: '20px'
	},
	label: {
		paddingRight: 0
	}
};

export {
	headerStyle,
	ticketStyle,
	menuStyle
};
