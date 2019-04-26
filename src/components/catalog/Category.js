import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  getProductsForCategoryOrChild,
  setCurrentProduct,
  updateProductsForCategoryOrChild,
  getFilteredProducts,
} from '../../actions';
import { ProductList } from '../common/ProductList';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_HOME_PRODUCT_PATH
} from '../../navigation/routes';


class Category extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title.toUpperCase(),
		headerBackTitle: ' '
	});

	componentDidMount() {
		this.props.getProductsForCategoryOrChild(this.props.category);
	}

  onRowPress = (product) => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name
    });
  };

  onRefresh = () => {
    const { params } = this.props;
    if (params) {
      if (params.maxValue && !params.minValue) {
        this.props.getFilteredProducts({
          page: 1,
          filter: {
            category_id: this.props.categoryId,
            price: {
              condition: 'lteq',
              value: params.maxValue,
            }
          }
        });
        return;
      } else if (params.minValue && !params.maxValue) {
        this.props.getFilteredProducts({
          page: 1,
          filter: {
            category_id: this.props.categoryId,
            price: {
              condition: 'gteq',
              value: params.minValue,
            }
          }
        });
        return;
      }
      this.props.getFilteredProducts({
        page: 1,
        filter: {
          category_id: this.props.categoryId,
          price: {
            condition: 'from,to',
            value: `${params.minValue},${params.maxValue}`,
          }
        }
      });
    } else {
      this.props.updateProductsForCategoryOrChild(this.props.category, true);
    }
  };

	onEndReached = () => {
		const {
			canLoadMoreContent,
			loadingMore,
			products,
			category,
      params,
		} = this.props;

		if (!loadingMore && canLoadMoreContent) {
		  if (params) {
		    if (params.maxValue && !params.minValue) {
          this.props.getFilteredProducts({
            page: products.length,
            filter: {
              category_id: this.props.categoryId,
              price: {
                condition: 'lteq',
                value: params.maxValue,
              }
            }
          });
          return;
        } else if (params.minValue && !params.maxValue) {
          this.props.getFilteredProducts({
            page: products.length,
            filter: {
              category_id: this.props.categoryId,
              price: {
                condition: 'gteq',
                value: params.minValue,
              }
            }
          });
          return;
        }
        this.props.getFilteredProducts({
          page: products.length,
          filter: {
            category_id: this.props.categoryId,
            price: {
              condition: 'from,to',
              value: `${params.minValue},${params.maxValue}`,
            }
          }
        });
      } else {
			  this.props.getProductsForCategoryOrChild(category, products.length);
      }
		}
	};

	render() {
		return (
			<View style={styles.containerStyle}>
				<ProductList
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.onRefresh}
            />
          }
					products={this.props.products}
					onEndReached={this.onEndReached}
					canLoadMoreContent={this.props.canLoadMoreContent}
					onRowPress={this.onRowPress}
          navigation={this.props.navigation}
				/>
			</View>
		);
	}
}

const styles = {
	MainContainer: {
		justifyContent: 'center',
		flex: 1,
		margin: 5,
		paddingTop: (Platform.OS) === 'ios' ? 20 : 0
	},
	containerStyle: {
		flex: 1,
		backgroundColor: '#fff',
	},
	notFoundTextWrap: {
		flex: 1,
		justifyContent: 'center',
	},
	notFoundText: {
		textAlign: 'center'
	},
	infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    marginTop: 0,
    fontSize: 16,
		padding: 0,
    fontWeight: '200',
    color: '#555',
  },
  priceStyle: {
    fontSize: 14,
    fontWeight: '200',
    textAlign: 'center',
  },
	imageStyle: {
		flex: 1
  },
	iconStyle: {
    height: 32,
    width: 40,
    margin: 5,
    marginRight: 0
  },
	iconWrapper: {
    marginTop: 5,
    marginRight: 10
  },
};

const mapStateToProps = state => {
	const { category } = state.category.current;
	const { products, totalCount, loadingMore, refreshing, params } = state.category;
	const canLoadMoreContent = products.length < totalCount;

	return {
	  category,
    products,
    totalCount,
    canLoadMoreContent,
    loadingMore,
    refreshing,
    params,
	};
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  updateProductsForCategoryOrChild,
  setCurrentProduct,
  getFilteredProducts,
})(Category);
