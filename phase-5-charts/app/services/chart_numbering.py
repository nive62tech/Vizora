import json
import os

COUNTER_FILE = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'phase-2-backend', 'app', 'chart_counter.json')


def get_next_chart_number() -> int:
    if not os.path.exists(COUNTER_FILE):
        _save_counter(0)
    
    with open(COUNTER_FILE, 'r') as f:
        data = json.load(f)
    
    next_num = data.get('count', 0) + 1
    _save_counter(next_num)
    return next_num


def reset_counter():
    _save_counter(0)


def _save_counter(count: int):
    os.makedirs(os.path.dirname(COUNTER_FILE), exist_ok=True)
    with open(COUNTER_FILE, 'w') as f:
        json.dump({'count': count}, f)