import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from './store';

@Module({ dynamic: true, store, name: 'message', namespaced: true })
class MessageModule extends VuexModule {

  private active = false;
  private message = '';
  private error = false;

  get alertMessage(): string {
    return this.message;
  }

  get isActive(): boolean {
    return this.active;
  }

  get isError(): boolean {
    return this.error;
  }

  @Mutation
  private _updateMessage(message: string): void {
    this.message = message;
  }

  @Mutation
  private _activate(error: boolean): void {
    this.error = error;
    this.active = true;
  }

  @Mutation
  private _deactivate(): void {
    this.active = false;
  }

  @Action
  public activate(payload: {
    message: string;
    error?: boolean;
  }): void {
    const message = payload.message;
    const error = payload.error ?? false;
    this._updateMessage(message);
    this._activate(error);

    setTimeout(() => {
      this._deactivate();
    }, 2000)
  }
}

export const messageModule = getModule(MessageModule);
