import NewAppEvent from '../components/admin/CurrentUpdates';
import EditMediaForm from '../components/admin/EditMediaForm';
import { MngmntWrapper } from '../components/admin/MngmntWrapper';
import classes from './AdminPage.module.css';

function AdminPage() {
    return (
    <div className={classes.admincontent}>
        <h1 className={classes.adminheader}>Librarian Page</h1>
        <section>
            <MngmntWrapper />
        </section>
    </div>)
}

export default AdminPage;