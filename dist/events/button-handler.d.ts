import { ButtonInteraction } from 'discord.js';
import { Button } from '../buttons/index.js';
import { EventDataService } from '../services/index.js';
import { EventHandler } from './index.js';
export declare class ButtonHandler implements EventHandler {
    private buttons;
    private eventDataService;
    private rateLimiter;
    constructor(buttons: Button[], eventDataService: EventDataService);
    process(intr: ButtonInteraction): Promise<void>;
    private findButton;
}
