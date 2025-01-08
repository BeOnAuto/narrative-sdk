import {Narrative} from "../Narrative";
import {Scheme} from "../scheme";
import {EventBase} from "../Events";
import {CommandBase} from "../Commands";


class MessageHandler {
    postMessage = jest.fn();
    addMessageListener = jest.fn();
}

describe('Narrative', () => {
    let messageHandler: MessageHandler;

    beforeEach(() => {
        messageHandler = new MessageHandler();
        Narrative._setMessageHandler(messageHandler);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createScheme', () => {
        it('should send a create-scheme message and resolve on success', async () => {
            const scheme: Scheme = { name: 'Test Scheme', categories: [] };
            const message = { type: 'create-scheme', scheme };

            messageHandler.addMessageListener.mockImplementation((listener) => {
                listener({ data: { type: 'command-response' } });
            });

            await expect(Narrative.createScheme(scheme)).resolves.toBeUndefined();
            expect(messageHandler.postMessage).toHaveBeenCalledWith(message);
        });

        it('should reject with an error if creation fails', async () => {
            const scheme: Scheme = { name: 'Test Scheme', categories: [] };
            const message = { type: 'create-scheme', scheme };

            messageHandler.addMessageListener.mockImplementation((listener) => {
                listener({ data: { type: 'command-response', error: 'Creation failed' } });
            });

            await expect(Narrative.createScheme(scheme)).rejects.toThrow('Creation failed');
            expect(messageHandler.postMessage).toHaveBeenCalledWith(message);
        });
    });

    describe('sendCommand', () => {
        class TestCommand extends CommandBase<any> {
            readonly name = 'TestCommand';
            constructor(params: any) {
                super(params);
            }
        }

        it('should send a command message and resolve on success', async () => {
            const params = { key: 'value' };
            const message = { type: 'command', commandClass: 'TestCommand', params };

            messageHandler.addMessageListener.mockImplementation((listener) => {
                listener({ data: { type: 'command-response' } });
            });

            await expect(Narrative.sendCommand(TestCommand, params)).resolves.toBeUndefined();
            expect(messageHandler.postMessage).toHaveBeenCalledWith(message);
        });

        it('should reject with an error if the command fails', async () => {
            const params = { key: 'value' };
            const message = { type: 'command', commandClass: 'TestCommand', params };

            messageHandler.addMessageListener.mockImplementation((listener) => {
                listener({ data: { type: 'command-response', error: 'Command failed' } });
            });

            await expect(Narrative.sendCommand(TestCommand, params)).rejects.toThrow('Command failed');
            expect(messageHandler.postMessage).toHaveBeenCalledWith(message);
        });
    });

    describe('subscribeToEvents', () => {
        class TestEvent extends EventBase {
            static get type() {
                return 'TestEvent';
            }
            constructor(public payload: any) {
                super();
            }
        }

        it('should subscribe to events and invoke the handler when event occurs', () => {
            const handler = jest.fn();
            const payload = { key: 'value' };

            messageHandler.addMessageListener.mockImplementation((listener) => {
                listener({ data: { type: 'event', event: 'TestEvent', payload } });
            });

            Narrative.subscribeToEvents([TestEvent], handler);

            expect(messageHandler.postMessage).toHaveBeenCalledWith({ type: 'subscribe', event: 'TestEvent' });
            expect(handler).toHaveBeenCalledWith(payload);
        });
    });

    describe('updateReadModel', () => {
        it('should send an update-store message', () => {
            const data = { key: 'value' };
            const message = { type: 'update-store', data };

            Narrative.updateReadModel(data);

            expect(messageHandler.postMessage).toHaveBeenCalledWith(message);
        });
    });
});