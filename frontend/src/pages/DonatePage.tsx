import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/cartContext";
import { useState } from "react";
import { CartItem } from "../types/cartItem";
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

function DonatePage() {
    const navigate = useNavigate();
    const {projectName, projectId} = useParams();
    const {addToCart} = useCart();
    const [donationAmount, setDonationAmount] = useState<number>(0);

    const handleAddToCart = () => {
        const newItem: CartItem = {
            projectId : Number(projectId),
            projectName: projectName || "no Project found",
            donationAmount,
            };
            addToCart(newItem);
            navigate('/cart')
        }
    
    return (
        <>
        <AuthorizeView>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <WelcomeBand />
        <h2>Donate to {projectName}</h2>

        <div>
            <input 
                type="number" 
                placeholder="Enter Donation Amount" 
                value={donationAmount} 
                onChange={(x) => setDonationAmount(x.target.value === "" ? "" : Number(x.target.value))} />
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>

        <button onClick={() => navigate(-1)}>Go Back</button>
        </AuthorizeView>
        </>
    );
}


export default DonatePage;