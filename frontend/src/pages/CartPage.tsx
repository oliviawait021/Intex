import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { CartItem } from "../types/cartItem";
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

function CartPage (){
    const navigate = useNavigate();
    const {cart, removeFromCart} = useCart();
    
    return(
        <>
        <AuthorizeView>
            <Logout>
            Logout <AuthorizedUser value="email" />
            </Logout>
            <div>
                <h3>Your Cart</h3>
                <div>
                    {cart.length === 0 ? 
                    (<p>Your cart is empty</p>) :
                    <ul>{cart.map((item: CartItem) =>
                        <li key={item.projectId}>
                            {item.projectName} : ${item.donationAmount.toFixed(2)}
                            <button onClick={() => removeFromCart(item.projectId)}>Remove</button>
                        </li>)}</ul> }
                </div>
                <h3>Total:</h3>
                <button>Checkout</button>
                <button onClick={() => navigate('/projects')}>Keep Browsing</button>
            </div>
        </AuthorizeView>
        </>
    );
}

export default CartPage;