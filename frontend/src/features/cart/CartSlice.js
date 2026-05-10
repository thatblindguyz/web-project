import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

// const saveCart = (items, userId) => {
//   const key = userId ? `cartItems_${userId}` : "cartItems";
//   localStorage.setItem(key, JSON.stringify(items));
// };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //   loadCart: (state, action) => {
    //     const userId = action.payload;
    //     const saved = localStorage.getItem(`cartItems_${userId}`);
    //     console.log("loadCart → key:", `cartItems_${userId}`, "| saved:", saved);
    //     state.cartItems = saved ? JSON.parse(saved) : [];
    //   },

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
      // saveCart(state.cartItems, action.payload?.userId);
    },

    removeFromCart: (state, action) => {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem._id !== action.payload._id,
      );
      state.cartItems = nextCartItems;
      // saveCart(state.cartItems, action.payload?.userId);
      toast.error(`${action.payload.name} removed from cart`, {
        position: "bottom-left",
      });
    },

    decreaseCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem._id === action.payload._id,
      );

      if (itemIndex === -1) return;

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;

        toast.info(`Decreased quantity of ${state.cartItems[itemIndex].name}`, {
          position: "bottom-left",
        });
      } else {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem._id !== action.payload._id,
        );

        state.cartItems = nextCartItems;

        toast.error(`${action.payload.name} removed from cart`, {
          position: "bottom-left",
        });
      }

      // saveCart(state.cartItems, action.payload?.userId);
    },

    clearCart: (state, action) => {
      const userId = action.payload?.userId;
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      if (userId) {
        localStorage.removeItem(`cartItems_${userId}`);
      } else {
        localStorage.removeItem("cartItems");
      }
      toast.error("Cart cleared", { position: "bottom-left" });
    },

    resetCart: (state) => {
      state.cartItems = [];

      state.cartTotalQuantity = 0;

      state.cartTotalAmount = 0;
    },

    getTotals: (state) => {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, discountPercent, isDiscount, cartQuantity } = cartItem;

          const effectivePrice =
            isDiscount && discountPercent > 0
              ? price * (1 - discountPercent / 100)
              : price;

          const itemTotal = effectivePrice * cartQuantity;
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

export const {
  addToCart,
  removeFromCart,
  decreaseCart,
  clearCart,
  getTotals,
  // loadCart,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
