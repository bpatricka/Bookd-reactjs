import NewAppEvent from '../components/admin/CurrentUpdates';
import { MngmntWrapper } from '../components/admin/MngmntWrapper';
import classes from './AdminPage.module.css';

function AdminPage() {
    return (
    <div className={classes.admincontent}>
        <h1 className={classes.adminheader}>Librarian Page</h1>
        <div className={classes.appevents}>
            <NewAppEvent />
        </div>
        <section>
            <MngmntWrapper />
        </section>
    </div>)
}

export default AdminPage;