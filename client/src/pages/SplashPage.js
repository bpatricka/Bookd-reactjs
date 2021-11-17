import { SignInButton } from "../components/SignInButton";
import classes from './SplashPage.module.css';
import { FaArrowRight, FaBook, FaShoppingBag } from 'react-icons/fa';

export const SplashPage = () =>{

    return (
        <div className={classes.bg} id='bg'>
            <div className={classes.bgol} id='bgol'>
                <div id='splashwrapper' className={classes.splashwrapper}>
                    <h1 style={{ color: '#FFF'}}>Book'd</h1>
                    
                    <SignInButton className={classes.sibtn} />
                    <div>
                        <h4 style={{ color: '#DDD'}}>Controlled Digital Lending for SCSU's Hilton Buley Library.</h4>
                    </div>
                    <h5 style={{ color: '#DDD'}}>SCSU Students rent books, audio, and video now!</h5>
                    <div style={{backgroundColor: 'rgba(222,222,222,0.7)', borderRadius: '10px', display: 'flex',padding: '20px', gap: '30px', alignItems: 'center' }}>
                        <FaBook style={{ width: '50px', height: '50px', color: '#003399'}} /><FaArrowRight style={{ width: '30px', height: '30px', color: '#003399'}} /><FaShoppingBag style={{ width: '50px', height: '50px', color: '#003399'}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashPage;