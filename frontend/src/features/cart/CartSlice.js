import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id,
      );

      // CHECK STOCK
      if (itemIndex >= 0) {
        const currentQty = state.cartItems[itemIndex].cartQuantity;
        const stock =
          action.payload.quantity || state.cartItems[itemIndex].quantity;

        if (currentQty >= stock) {
          toast.error("Out of stock", {
            position: "bottom-left",
          });
          return;
        }

        state.cartItems[itemIndex].cartQuantity += 1;

        toast.info(`Increased quantity of ${state.cartItems[itemIndex].name}`, {
          position: "bottom-left",
        });
      } else {
        if (action.payload.quantity === 0) {
          toast.error("Product is out of stock", {
            position: "bottom-left",
          });
          return;
        }

        const tempProduct = {
          ...action.payload,
          shortDesc: action.payload.shortDesc || action.payload.desc,
          cartQuantity: 1,
        };

        state.cartItems.push(tempProduct);

        toast.success(`${action.payload.name} added to cart`, {
          position: "bottom-left",
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem._id !== action.payload._id,
      );
      state.cartItems = nextCartItems;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.error(`${action.payload.name} removed from cart`, {
        position: "bottom-left",
      });
    },

    decreaseCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem._id === action.payload._id,
      );
      if (state.cartItems[itemIndex].cartQuantity > 1) {
        if (itemIndex === -1) return;
        state.cartItems[itemIndex].cartQuantity -= 1;
        toast.info(`Decreased quantity of ${state.cartItems[itemIndex].name}`, {
          position: "bottom-left",
        });
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem._id !== action.payload._id,
        );
        state.cartItems = nextCartItems;

        toast.error(`${action.payload.name} removed from cart`, {
          position: "bottom-left",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
      toast.error("Cart cleared", { position: "bottom-left" });
    },

    getTotals: (state, action) => {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        },
      );
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
  },
});

export const { addToCart, removeFromCart, decreaseCart, clearCart, getTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
