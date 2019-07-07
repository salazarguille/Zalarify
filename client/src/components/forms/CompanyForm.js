import { withStyles } from '@material-ui/styles';
import React from 'react';

const styles = theme => ({
    wrapper: {
	    padding: '6rem 0 4rem 0',
    },
    inner: {
        margin: '0 auto',
		maxWidth: 'calc(100% - 10rem)',
		width: '80rem',
    },
    header: {
        borderBottom: '1px solid',
		margin: '0 auto 2rem auto',
		maxWidth: '80%',
		textAlign: 'center',
		width: '45.7142857143rem',
        '& h1': {
            fontSize: '3rem',
            fontFamily: "'Fjalla One', sans-serif",
            fontWeight: 400,
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.25rem',
        },
        '& p': {
            fontSize: '1.5rem',
            color: '#4468ca',
        },
    },
    form: {
	    margin: 0,
        padding: 0,
        border: 0,
        fontSize: '100%',
        font: 'inherit',
        verticalAlign: 'baseline',

        display: '-moz-flex',
		display: '-webkit-flex',
		display: '-ms-flex',
		display: 'flex',
		'-moz-flex-wrap': 'wrap',
		'-webkit-flex-wrap': 'wrap',
		'-ms-flex-wrap': 'wrap',
		flexWrap: 'wrap',
		width: '100%',
		margin: '-2rem auto 2rem auto',
        display: 'block',
        margin: '0 0 2rem 0',
        '& elements': {
            display: 'block',
            margin: '0 0 2rem 0',
        }
    },
    row: {
        display: 'flex',
		flexWrap: 'wrap',
		boxSizing: 'border-box',
		alignItems: 'stretch',
        marginBottom: 0,
        margin: '1rem 0.5rem 0rem 0.5rem',
    },
    input: {
        '-moz-appearance': 'none',
		'-webkit-appearance': 'none',
		'-ms-appearance': 'none',
		appearance: 'none',
		borderRadius: '4px',
		border: 'solid 1px',
		color: 'inherit',
		display: 'block',
		outline: 0,
		padding: '0 1rem',
		textDecoration: 'none',
		width: '100%',
        height: '3.25rem',
        backgroundColor: 'transparent',
		borderColor: 'rgba(0, 0, 0, 0.15)',
        fontFamily: '"Source Sans Pro", Arial, Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: '1rem',
        lineHeight: 1.65,
    },
    inputFocused: {
        borderColor: '#4468ca',
        boxShadow: '0 0 0 1px #4468ca',
    },
    textarea: {
        '-moz-appearance': 'none',
        '-webkit-appearance': 'none',
        '-ms-appearance': 'none',
        'appearance': 'none',
        fontFamily: '"Source Sans Pro", Arial, Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: '1rem',
        lineHeight: 1.65,
    },
    ul: {
        listStyle: 'disc',
        margin: '0 0 2rem 0',
        paddingLeft: '1rem',
        display: '-moz-flex',
        '& actions': {
            display: '-webkit-flex',
            display: '-ms-flex',
            display: 'flex',
            cursor: 'default',
            listStyle: 'none',
            marginLeft: '-1rem',
            paddingLeft: 0,
        },
        '& li':{
            paddingLeft: '0.325rem'
        },
    },
    submit: {
        '-moz-appearance': 'none',
		'-webkit-appearance': 'none',
		'-ms-appearance': 'none',
		appearance: 'none',
		'-moz-transition': 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out',
		'-webkit-transition': 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out',
		'-ms-transition': 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out',
		transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out',
		border: 0,
		borderRadius: '4px',
		cursor: 'pointer',
		display: 'inline-block',
		fontFamily: '"Fjalla One", sans-serif',
		fontSize: '1rem',
		fontWeight: 400,
		height: '3.25rem',
		letterSpacing: '0.1rem',
		lineHeight: '3.375rem',
		padding: '0 2rem 0 2rem',
		textAlign: 'center',
		textDecoration: 'none',
		textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        backgroundColor: '#4468ca',
        boxShadow: 'none',
        color: '#ffffff !important'
    },
});

class CompanyForm extends React.Component {
    state = {
        company: {
            id: undefined,
            name: undefined,
            website: undefined,
            description: undefined,
        }
    }
    constructor(props) {
        super(props);
    }

    handleValidation = (e, field) => {
        e.preventDefault();
        this.setState({
            company: {
                ...this.state.company,
                [field]: e.target.value
            }
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                <div className={classes.inner}>
					<header class={classes.header}>
						<h1>Company Form</h1>
						<p>It creates a company in the blockchain.</p>
                    </header>
                </div>
                <form method="post" action="#" className={classes.form}>
                    <div className={classes.row}>
                        <input
                            className={classes.input} 
                            classes={{ focus: classes.inputFocused}}
                            value={this.props.info.selectedAddress}
                            type="text" 
                            disabled
                        />
                    </div>
                    <div className={classes.row}>
                        <input
                            className={classes.input} 
                            classes={{ focus: classes.inputFocused}}
                            value={this.state.id}
                            onChange={ e => this.handleValidation(e,'id')}
                            type="text" 
                            placeholder="Company ID"
                        />
                    </div>
                    <div className={classes.row}>
                        <input
                            className={classes.input} 
                            classes={{ focus: classes.inputFocused}}
                            value={this.state.name}
                            onChange={ e => this.handleValidation(e,'name')}
                            type="text" 
                            placeholder="Company Name"
                        />
                    </div>
                    <div className={classes.row}>
                        <input
                            className={classes.input} 
                            classes={{ focus: classes.inputFocused}}
                            value={this.state.website}
                            onChange={ e => this.handleValidation(e,'website')}
                            type="url" 
                            placeholder="Company Website"
                        />
                    </div>
                    <div className={classes.row}>
                        <textarea
                            className={classes.input} 
                            classes={{ focus: classes.inputFocused}}
                            value={this.state.description}
                            onChange={ e => this.handleValidation(e,'description')}
                            placeholder="Company Description"
                            rows="16">
                        </textarea>
                    </div>
                    <div class="col-12">
                        <ul className={classes.ul}>
                            <li><input className={classes.submit} type="submit" value="Submit"  /></li>
                            <li><input className={classes.submit} type="reset" value="Reset" style={{color: '#000000', backgroundColor: 'transparent',
		boxShadow: 'inset 0 0 0 1px #282828',
		}} /></li>
                        </ul>
                    </div>
                </form>
			</div>
        );
    }
}

export default withStyles(styles)(CompanyForm);
