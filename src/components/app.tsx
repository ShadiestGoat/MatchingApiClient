import { FunctionalComponent } from 'preact';
import Router from 'preact-router';
import Questionair from './questions';

// Ik its kinda not standard but major version (1st number) only changed when 'major' (subjective) changes are made to the api (eg. a rewrite of the profile)
// Second number is backwards breaking stuff
// Third is bug fixes
// From now on, it will stay consistent!
export const Version = "1.5.2"

const App: FunctionalComponent = () => {


    return (
        <Router>
            <Questionair path="/q/:name" />
        </Router>
    );
};

export default App;
