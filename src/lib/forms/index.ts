import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';

type Form = RemoteForm<RemoteFormInput, Promise<unknown>>;
type EnhanceParams<T extends Form> = Parameters<Parameters<T['enhance']>[0]>[0];
type CallbackParams<T extends Form> = Pick<EnhanceParams<T>, 'form' | 'data'> & { result: unknown };
type Callback<T extends Form> = (params: CallbackParams<T>) => Promise<unknown> | unknown;
type ErrorParams<T extends Form> = Pick<EnhanceParams<T>, 'form' | 'data'> & { error: unknown };
type ErrorCallback<T extends Form> = (params: ErrorParams<T>) => Promise<unknown> | unknown;
type EnhanceOptions<T extends Form> = {
	onInvalid?: Callback<T>;
	onSuccess?: Callback<T>;
	onSubmit?: Callback<T>;
	onError?: ErrorCallback<T>;
	reset?: boolean;
};

export function makeEnhance<T extends Form>(
	remoteForm: T,
	{ onInvalid, onSuccess, onSubmit, onError, reset = true }: EnhanceOptions<T>
) {
	return async ({ submit, ...rest }: EnhanceParams<T>) => {
		const params: CallbackParams<T> = {
			...rest,
			result: remoteForm.result
		};
		try {
			await submit();
			if (remoteForm.fields.allIssues()) {
				await onInvalid?.(params);
			} else {
				await onSuccess?.(params);
			}
			await onSubmit?.(params);
			if (reset) {
				params.form.reset();
			}
		} catch (error) {
			await onError?.({
				...rest,
				error
			});
		}
	};
}
