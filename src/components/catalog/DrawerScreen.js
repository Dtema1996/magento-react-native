import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Text } from 'react-native-elements';
import { getFilteredProducts, getProductsForCategoryOrChild, setFilterParams, } from '../../actions';
import { Button } from '../common';


class DrawerScreen extends Component {

  static propTypes = {};

  static defaultProps = {};

  state = {
    maxValue: '',
    minValue: '',
  };

  onApplyPressed = () => {
    const { setFilterParams, getProductsForCategoryOrChild, getFilteredProducts, navigation } = this.props;
    const { maxValue, minValue } = this.state;
    if (maxValue === '' && minValue === '') {
      getProductsForCategoryOrChild(this.props.category.current.category);
      return navigation.closeDrawer();
    }
    if (maxValue === '' || minValue !== '') {
      setFilterParams({ minValue });
      getFilteredProducts({
        page: 1,
        filter: {
          category_id: this.props.categoryId,
          price: {
            condition: 'gteq',
            value: `${this.state.minValue}`,
          }
        }
      });
      return navigation.closeDrawer();
    }
    if (maxValue !== '' || minValue === '') {
      setFilterParams({ maxValue });
      getFilteredProducts({
        page: 1,
        filter: {
          category_id: this.props.categoryId,
          price: {
            condition: 'lteq',
            value: `${this.state.maxValue}`,
          }
        }
      });
      return navigation.closeDrawer();
    }
    setFilterParams({ maxValue, minValue });

    getFilteredProducts({
      page: 1,
      filter: {
        category_id: this.props.categoryId,
        price: {
          condition: 'from,to',
          value: `${this.state.minValue},${this.state.maxValue}`,
        }
      }
    });
    navigation.closeDrawer();
  };

  render() {
    const {
      buttonStyle,
      container,
      InputContainer,
      textStyle,
      minInputStyle,
      maxInputStyle,
      dashTextStyle,
      inputContainerStyle
    } = styles;

    return (
      <View style={container}>
        <View style={InputContainer}>
          <Text style={textStyle}>Price:</Text>
          <View style={inputContainerStyle}>
            <TextInput
              style={minInputStyle}
              placeholder='Min.'
              onChangeText={(minValue) => this.setState({ minValue })}
            />
            <Text style={dashTextStyle}>-</Text>
            <TextInput
              style={maxInputStyle}
              placeholder='Max.'
              onChangeText={(maxValue) => this.setState({ maxValue })}
            />
          </View>
        </View>
        <View style={buttonStyle}>
          <Button onPress={this.onApplyPressed}>
            Apply
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  InputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  minInputStyle: {
    marginTop: 25,
    width: 50,
  },
  maxInputStyle: {
    marginTop: 25,
    width: 50,
  },
  textStyle: {
    marginTop: 20,
    fontSize: 18,
    lineHeight: 40,
    paddingLeft: 50,
  },
  dashTextStyle: {
    marginTop: 20,
    fontSize: 18,
    lineHeight: 40,
    paddingRight: 23,
  },
  inputContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
});

const mapStateToProps = ({ category }) => {
  const categoryId = category.current && category.current.category ? category.current.category.id : null;
  return { categoryId, category };
};

export default connect(mapStateToProps, { getFilteredProducts, getProductsForCategoryOrChild, setFilterParams })(DrawerScreen);
