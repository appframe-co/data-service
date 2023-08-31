import { RoutesInput } from '@/types/types'
import data from './data.route'

export default ({ app }: RoutesInput) => {
    app.use('/api/data', data);
};