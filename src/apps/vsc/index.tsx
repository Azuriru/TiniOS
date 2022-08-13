import { GlobalApp } from '../../components/AppsContext';
import { Instance } from '../../redux/instances';
import { default as manifest } from './index.json';

class VSC {
    constructor(public app: GlobalApp) {
    }

    render(instance: Instance) {
        return (
            <div>
                vsc? {instance.id}
            </div>
        );
    }
}

export default {
    manifest,
    class: VSC
};
