Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `<div class="product">
			<div class="product-image">
				<img :src="image" :alt="altText">
			</div>

			<div class="product-info">
				<h1>{{ title}}</h1>
				<p v-if="inStoks">In Stock</p>
				<p v-else
					:class="{testClass: !inStoks }">
					Out of Stock
				</p>
				<p>Shpping {{ shipping }}</p>
				
				<ul>
					<li v-for="detail in details">{{ detail }}</li>
				</ul>

				<div v-for="(variant, index) in variants" 
					:key="variant.variantId"
					class="color-box"
					:style="{ backgroundColor: variant.variantColor}"
					@mouseover="updateProduct(index)">
				</div>

				<button @click="addToCart" 
						:disabled="!inStoks"
						:class="{ disabledButton: !inStoks }">
					Add to Cart
				</button>
			</div>
			
		</div>
	`,
	data() {
		return {
			brand: 'Vue Master',
			product: 'Socks',
			description: 'A pair of warm, fuzzy socks',
			selectedVariant: 0,
			altText: 'A pair of green socks',
			details: ["80% cotton", "20% polyestar", "Gender-neutral"],
			variants: [
				{
					variantId: 123,
					variantColor: "green",
					variantImage: 'imgs/socks.jpg',
					variantQuantity: 10
				},
				{
					variantId: 456,
					variantColor: "blue",
					variantImage: 'imgs/socks-blue.jpg',
					variantQuantity: 0
				}

			],
		}
	},
	methods: {
		addToCart() {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
		},
		updateProduct(index) {
			this.selectedVariant = index;
		}
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStoks() {
			return this.variants[this.selectedVariant].variantQuantity > 0
		},
		shipping() {
			if (this.premium) {
				return "Free";
			} else {
				return 2.99;
			}
		}
	}

});

var app = new Vue({
	el: '#app',
	data: {
		oneTopHot: false,
		cart: []
	},
	methods: {
		updateCart(id) {
			this.cart.push(id);
		}
	}
});