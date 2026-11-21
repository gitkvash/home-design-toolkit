import unittest

import common


class T(unittest.TestCase):
    def test_num(self):
        self.assertEqual(common.num("1 234,50 ₾"), 1234.5)
        self.assertEqual(common.num("1,234.50"), 1234.5)
        self.assertEqual(common.num("12,5"), 12.5)
        self.assertEqual(common.num("1,234"), 1234.0)
        self.assertIsNone(common.num("call us"))

    def test_size(self):
        self.assertEqual(common.size_cm("Slab 60x120 cm"), (60.0, 120.0))
        self.assertEqual(common.size_cm("600*1200 mm"), (60.0, 120.0))
        self.assertEqual(common.size_cm("0,53x10,05 m"), (53.0, 1005.0))
        self.assertIsNone(common.size_cm("no size here"))

    def test_per_m2(self):
        self.assertEqual(common.per_m2(30, "m2")[0], 30)
        self.assertAlmostEqual(common.per_m2(60, "box", box_m2=2.0)[0], 30)
        self.assertAlmostEqual(common.per_m2(7.2, "pc", size=(60, 120))[0], 10)
        self.assertIsNone(common.per_m2(9, "pc")[0])

    def test_warning_flags_only(self):
        self.assertTrue(common.unit_warning(5000))
        self.assertFalse(common.unit_warning(45))

    def test_dedupe_key(self):
        a = {"brand": "Acme", "name": "Oak  Natural!", "sizeCm": (19.2, 128.5)}
        b = {"brand": "acme", "name": "oak natural", "sizeCm": (19.0, 128.0)}
        self.assertEqual(common.dedupe_key(a), common.dedupe_key(b))


if __name__ == "__main__":
    unittest.main()
