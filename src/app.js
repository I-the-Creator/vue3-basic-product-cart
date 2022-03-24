let app = Vue.createApp({
    data() {
      return {
        showSideBar: false,
        inventory: [],
        cart: {},
      };
    },
    computed: {
      // total quantity  - the sum of all item quantities in cart
      totalQuantity() {
        return Object.values(this.cart).reduce((acc, currentItemValue) => {
          return acc + currentItemValue
        }, 0)
      }
    },
    methods: {
      addToCart(name, index) {
        //receive items name and numbers
        if (!this.cart[name]) this.cart[name] = 0; /* set the starting value of product key if it's not exist - otherwise get undefined and set NaN in next string*/
        if (!this.inventory[index].quantity) this.inventory[index].quantity = 0;
        this.cart[name] += this.inventory[index].quantity; /* update quantity of product (value of key) */
        this.inventory[index].quantity = 0; /* reset value after adding */
      },
      toggleSideBar() {
        /* toggle side bar function */
        this.showSideBar = !this.showSideBar;
      },
      removeItem(name) {
        /* delete property from 'cart' object */
        delete this.cart[name];
      },
    },
    async mounted() {
      const res = await fetch("./food.json");
      const data = await res.json();
      this.inventory = data;
    },
  });

  app.component("sidebar", {
    props: [
      "toggle",
      "cart",
      "inventory",
      "remove",
    ] /* receiving the props */,
    computed: {},
    methods: {
      /* helper to get price from inventory by product name - key in 'cart' object:
  iterate through'inventory array - this.inventory' items and find product name which is equal to provided argument
  and return its price
  */
      getPrice(name) {
        const product = this.inventory.find((prod) => {
          return prod.name === name;
        });
        return product.price.USD;
      },
      calculateTotal() {
        if (Object.keys(this.cart).length === 0) {
          /* object has no properties */
          return 0;
        } else {
          /* get array of [key, value] arrays out of 'cart' object, and via 'reduce' we calculation the sum on each iteration
      through this array - each time to sum up 'acc' value with 'currentItem * price'
      currentItem - is an array of [key, value] - [Raddishes, X]
      */
          const total = Object.entries(this.cart).reduce(
            (acc, currentItem, index) => {
              return acc + currentItem[1] * this.getPrice(currentItem[0]);
            },
            0
          );
          return total.toFixed(2);
        }
      },
    },
    /*html*/
    template: `
      <aside class="cart-container">
        <div class="cart">
          <h1 class="cart-title spread">
            <span>
              Cart
              <i class="icofont-cart-alt icofont-1x"></i>
            </span>
            <button @click="toggle" class="cart-close">&times;</button>
          </h1>

          <div class="cart-body">
            <table class="cart-table">
              <thead>
                <tr>
                  <th><span class="sr-only">Product Image</span></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody> 
                <tr v-for="(quantity, key, i) in cart" :key="i">
                  <td><i class="icofont-carrot icofont-3x"></i></td>
                  <td>{{ key }}</td>
                  <td>\${{ getPrice(key) }}</td>
                  <td class="center">{{ quantity }}</td>
                  <td>\${{ (quantity * getPrice(key)).toFixed(2) }}</td>
                  <td class="center">
                    <button @click="remove(key)" class="btn btn-light cart-remove">
                      &times;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
            <div class="spread">
              <span><strong>Total:</strong> \${{calculateTotal()}}</span>
              <button class="btn btn-light">Checkout</button>
            </div>
          </div>
        </div>
      </aside>
    `,
  });

app.mount("#app");