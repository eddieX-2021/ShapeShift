// test/generateWorkoutPlan.test.js
const { generateWorkoutPlan } = require('../generateWorkoutPlan');

jest.mock('axios');

describe('Workout Plan Generator', () => {
  it('should return parsed exercises', async () => {
    const mockResponse = {
      data: {
        candidates: [{
          content: `Exercise Name: Squats\nSets: 3\nReps: 10\nDescription: Bodyweight squats`
        }]
      }
    };
    
    axios.post.mockResolvedValue(mockResponse);
    
    const plan = await generateWorkoutPlan({
      goal: 'strength',
      level: 'beginner',
      duration: 4
    });
    
    expect(plan).toEqual([{
      name: 'Squats',
      sets: 3,
      reps: '10',
      description: 'Bodyweight squats'
    }]);
  });
});