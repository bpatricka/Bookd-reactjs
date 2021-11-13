import ProfileContent from '../components/account/ProfileContent';
import RentalWrapper from '../components/account/RentalWrapper';
import classes from "./AccountPage.module.css";
import UserContext from '../store/user-context';
import { useContext } from 'react';

function AccountPage() {
    const userCtx = useContext(UserContext);
    return (
    <div className={classes.acctcontent}>
        <div className={classes.pageheader}></div>
        <div>
            <ProfileContent />
        </div>
        <div className={classes.rentwrapper}>
            <RentalWrapper />
        </div>
    </div>
    )
}

export default AccountPage;