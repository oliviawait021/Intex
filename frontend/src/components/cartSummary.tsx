import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";

const CartSummary = () => {
    const navigate = useNavigate();
    const {cart} = useCart();
    const totalAmount = cart.reduce((sum, item) => sum + item.donationAmount, 0)
    return(
        <div style={{
            position: 'fixed',
            top:'30px',
            right: '20px',
            background: '#f8f9fa',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(115, 51, 51, 0.2)',
            fontSize: '16px'
        }}
        onClick={() => navigate('/cart')}
        >🛒<strong>{totalAmount.toFixed(2)}</strong>
        </div>
    );
}

export default CartSummary;

