var eventBus = new Vue()

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

			<product-tabs :reviews="reviews"></product-tabs>

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
			reviews: []
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
	},
	mounted() {
		eventBus.$on('review-submitted', productReview => {
			this.reviews.push(productReview);
		})
	}

});

Vue.component('product-review', {
	template: `
	<form class="review-form" @submit.prevent="onSubmit">
		<p v-if="errors.length">
			<b>Please correct the folloving errors</b>
			<ul>
				<li v-for="error in errors">{{ error }}</li>
			</ul>
		</p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			if (this.name && this.review && this.rating) {
				let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating
				}
				eventBus.$emit('review-submitted', productReview)
				this.name = null,
				this.review = null,
				this.rating = null,
				this.errors = []
			} else {
				if(!this.name) { this.errors.push("Name is required.")};
				if(!this.review) { this.errors.push("Review is required.")};
				if(!this.rating) { this.errors.push("Rating is required.")};
			}
			
		}
	}
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}
	},
	template: `
	<div>
		<div>
			<span class="tab" 
			:class="{ activeTab: selectedTab === tab }"
			v-for="(tab, index) in tabs" 
			:key="index"
			@click="selectedTab = tab"
			>
				{{ tab }}
			</span>
		</div>

		<div v-show="selectedTab === 'Reviews'">
			<div>
				<p v-if="!reviews.length">There are no reviews yet.</p>
				<ul>
					<li v-for=" review in reviews">
						<p>{{ review.name }}</p>
						<p>Rate: {{ review.rating }}</p>
						<p>{{ review.review }}</p>
					</li>
				</ul>
			</div>
		</div>

		<div v-show="selectedTab === 'Make a Review'">
			<product-review></product-review>
		</div>

	</div>
	`,
	data() {
		return {
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Reviews'
		}
	}
})

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