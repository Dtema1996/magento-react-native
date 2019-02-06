import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, Text, Button } from 'react-native';
import { getProductsForCategoryOrChild } from '../../actions';
import ProductListItem from './ProductListItem';
import { Spinner } from '../common';

class ProductList extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title.toUpperCase(),
		headerBackTitle: ' '
	});

	constructor() {
    super();
    this.state = { gridView: true, btnText: 'Show List' };
  }

	componentWillMount() {
		this.props.getProductsForCategoryOrChild(this.props.category);
	}

	onEndReached() {
		const {
			canLoadMoreContent,
			loadingMore,
			products,
			category
		} = this.props;

		if (!loadingMore && canLoadMoreContent) {
			this.props.getProductsForCategoryOrChild(category, products.length);
		}
	}

	changeView = () => {
    this.setState({ gridView: !this.state.gridView }, () => {
      if (this.state.gridView) {
        this.setState({ btnText: 'Show List' });
      } else {
        this.setState({ btnText: 'Show Grid' });
      }
    });
  }

	renderItem(product) {
		return <ProductListItem product={product.item} />;
	}

	renderFooter() {
		if (this.props.canLoadMoreContent) {
			return <Spinner style={{ padding: 15 }} />;
		}
	}

	renderContent() {
		if (!this.props.products) {
      return <Spinner />;
    }

		if (this.props.products.length) {
			return (
				<View>
					<Button
						title={this.state.btnText}
						onPress={this.changeView}
					/>
					<FlatList
						key={(this.state.gridView) ? 1 : 0}
						numColumns={this.state.gridView ? 2 : 1}
						data={this.props.products}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
						onEndReached={this.onEndReached.bind(this)}
						onEndReachedThreshold={10}
						ListFooterComponent={this.renderFooter.bind(this)}
					/>
				</View>
			);
		}

		return (
			<View style={styles.notFoundTextWrap}>
				<Text style={styles.notFoundText}>No products found</Text>
			</View>
		);
	}

	render() {
		return (
				<View style={styles.containerStyle}>
					{this.renderContent()}
				</View>
		);
	}
}

const styles = {
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
};

const mapStateToProps = state => {
	const { category } = state.category.current;
	const { products, totalCount, loadingMore } = state.category;
	const canLoadMoreContent = products.length < totalCount;

	return { category, products, totalCount, canLoadMoreContent, loadingMore };
};

export default connect(mapStateToProps, { getProductsForCategoryOrChild })(ProductList);
