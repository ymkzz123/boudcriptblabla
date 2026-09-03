export interface LifeRecoveryRewardProvider {
  getRewardUnits(entityTypeId: string): number | undefined;
}

export const unresolvedLifeRecoveryRewardProvider: LifeRecoveryRewardProvider = {
  getRewardUnits(): undefined {
    return undefined;
  },
};
