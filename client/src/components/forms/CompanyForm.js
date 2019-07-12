import { withStyles } from '@material-ui/styles';
import React from "react";
import {
  Button,
  Form,
  Text,
  Textarea
} from "rimble-ui";

const styles = theme => ({
  inputSelect: {
    color: '#3F3D4B',
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '16px',
    paddingRight: '16px',
    height: "3rem",
    border: '1px solid transparent',
    borderColor: '#CCC',
    borderRadius: '4px',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    fontSize: '1rem',
    fontFamily: '"Source Sans Pro",sans-serif',
    width:'100%'
  },
});

class CompanyForm extends React.Component {
  state = {
    validated: false,
    company: {
      name: '',
      website: '',
      description: '',
    },
    processing: false,
  };

  componentDidMount = async () => {
    const { company } = this.props;
    if( company !== undefined) {
      this.setState({
        company,
      });
    }
  };

  handleValidation = (e, field) => {
    e.preventDefault();
    this.setState({
        company: {
        ...this.state.company,
        [field]: e.target.value
      }
    });
    e.target.parentNode.classList.add('was-validated');
  };

  handleSubmit = e => {
    e.preventDefault();
    const newCompany = this.state.company;
    if(this.props.handleSubmit !== undefined) {
      this.props.handleSubmit(newCompany);
    }
  };

  static getDerivedStateFromProps(nextProps, nextContext) {
    if( nextProps.processing ) {
        return {
          processing: nextProps.processing,
        };
    }
    return null;
  }

  render() {
    const renderProcessing = this.props.processing ? <Text width={1} p={2} mr={5} textAlign="center" fontSize="21px">
    Transaction is processing...
  </Text> : '';
    return (
      <Form width={'100vw'} p={15} onSubmit={this.handleSubmit}>
        <Form.Field validated={this.state.validated} label="Name" width={1}>
          <Form.Input
            type="text"
            required
            style={{width:'100%'}}
            placeholder="My Company LLC"
            onChange={ e => this.handleValidation(e,'name')}
            value={this.state.company.name}
          />
        </Form.Field>
        <Form.Field validated={this.state.validated} label="Website" width={1}>
          <Form.Input
            type="url"
            required
            style={{width:'100%'}}
            placeholder="https://www.mycompany.com"
            onChange={e => this.handleValidation(e, 'website')}
            value={this.state.company.website}
          />
        </Form.Field>
        <Form.Field validated={this.state.validated} label="Description (Max 32 chars.)" width={1}>
          <Textarea
            type="text"
            required
            maxLength="32"
            minLength="1"
            style={{width:'100%'}}
            placeholder="Description about my company."
            onChange={e => this.handleValidation(e, 'description')}
            value={this.state.company.description}
          />
        </Form.Field>
        {renderProcessing}
        <Button disabled={this.props.processing} type="submit" style={{width:'100%'}}>
          Create
        </Button>
      </Form>
    );
  }
}

export default withStyles(styles)(CompanyForm);