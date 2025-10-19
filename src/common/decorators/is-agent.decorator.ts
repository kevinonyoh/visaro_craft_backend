import { SetMetadata } from "@nestjs/common";

export const IS_AGENT_KEY = 'is_agent';

export const IsAgent = () => SetMetadata(IS_AGENT_KEY, true);