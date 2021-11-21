import { HomepageContent } from "../components/home/HomepageContent";
import classes from './HomePage.module.css';

function HomePage() {
    return (
    <div className={classes.homeimg}>
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', }}>
            <div className={classes.homecontent}>
                    <HomepageContent />
            </div>
        </div>
    </div>
    )
}

export default HomePage;