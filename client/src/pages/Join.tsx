import { useActionState } from 'react';
import { FormButton } from '../components/atoms/Button';
import { useNavigate } from 'react-router-dom';

export default function Join() {
    const nav = useNavigate();
    const [error, submitAction] = useActionState(async (previousState: any, formData: FormData) => {
        const id = formData.get('user-id');
        nav(`/coding-us?id=${id}`);
        return null;
    }, null);

    return (
        <form
            className="w-full h-full flex flex-col items-center py-6 lg:items-center lg:justify-center gap-3 bg-slate-500"
            action={submitAction}
        >
            <div className="text-gray-50">Enter Your Name</div>
            <input name="user-id" className="w-48 rounded-sm" />
            <FormButton className="w-48">JOIN</FormButton>
        </form>
    );
}
