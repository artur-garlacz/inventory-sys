import { AwilixContainer, createContainer, InjectionMode, NameAndRegistrationPair } from 'awilix';

export interface AppAwilixContainer<TDependencies = unknown> {
  awilix: AwilixContainer;
  registrations: NameAndRegistrationPair<TDependencies>;
  resolve<TKey extends keyof TDependencies>(key: TKey): TDependencies[TKey];
  tryResolveAll(): void;
}

export type ContainerRegistrations<TContainer extends AppAwilixContainer> = TContainer['registrations'];

export const createAppContainer = <TDependencies>(
  registrations: NameAndRegistrationPair<TDependencies>
): AppAwilixContainer<TDependencies> => {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  container.register(registrations);

  const resolve = <TKey extends keyof TDependencies>(key: TKey): TDependencies[TKey] =>
    container.resolve<TDependencies[TKey]>(key.toString());

  const tryResolveAll = () => Object.keys(container.registrations).forEach((key) => container.resolve(key));

  return {
    awilix: container,
    registrations,
    resolve,
    tryResolveAll
  };
};
