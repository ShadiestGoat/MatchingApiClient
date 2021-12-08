import { FunctionalComponent } from 'preact';
import style from './style.css';

const Notfound: FunctionalComponent = () => {
    return (
        <div class={style.notfound}>
            <h1>Error 404</h1>
            <p>That page doesn&apos;t exist.</p>
            {/* <Link
            <ChangePage page="" push="up" /> */}
        </div>
    );
};

export default Notfound;
