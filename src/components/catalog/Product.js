import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Button } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { getProductMedia } from '../../actions';
import { magento } from '../../magento';
import { Spinner } from '../common';
import { getProductCustomAttribute } from '../../helper/product';

class Product extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerBackTitle: ' '
	});

	componentWillMount() {
		const { product, media } = this.props;

		if (!media) {
			this.props.getProductMedia({ sku: product.sku });
		}
	}

	renderMedia() {
		const { media } = this.props;

		if (!media) {
			return <Spinner />;
		}
		return (
				<Swiper
						showsPagination
						pagingEnabled
						autoplay={false}
				>
					{this.renderMediaItems()}
				</Swiper>
		);
	}

	renderMediaItems() {
		const { media } = this.props;

		return media.map(item => {
			return (
				<Image
						key={item.id}
						style={styles.imageStyle}
						resizeMode="contain"
						source={{ uri: magento.getProductMediaUrl() + item.file }}
				/>
			);
		});
	}

	renderDescription() {
		const { product } = this.props;
		const attribute = getProductCustomAttribute(product, 'short_description');

		if (attribute) {
			return (
					<Text style={styles.descriptionStyle}>{attribute.value}</Text>
			);
		}
	}

	onPressAddToCart() {
		console.log('onPressAddToCart');
	}

	render() {
		return (
				<ScrollView style={styles.container}>
					<View style={styles.imageContainer}>
						{this.renderMedia()}
					</View>
					<Text style={styles.textStyle}>{this.props.product.name}</Text>
					<Text style={styles.textStyle}>
						{magento.storeConfig.default_display_currency_code}
						{' '}
						{this.props.product.price}
					</Text>
					{this.renderDescription()}
					<Button
							onPress={this.onPressAddToCart.bind(this)}
							title="Add to Cart"
							color="#841584"
					/>
				</ScrollView>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	imageContainer: {
		height: 300,
	},
	imageStyle: {
		height: 290,
		top: 0
	},
	textStyle: {
		padding: 10,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	descriptionStyle: {
		padding: 10,
	},
};

const mapStateToProps = state => {
	const { product, media } = state.product.current;
	console.log('Product Component');
	console.log(product);
	console.log(media);

	return { product, media };
};

export default connect(mapStateToProps, { getProductMedia })(Product);