import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
import app


class PrepareResumeTextTests(unittest.TestCase):
    def test_short_resume_is_kept(self):
        text = "Software engineer with 5 years of experience in Python and React."
        self.assertEqual(app.prepare_resume_text(text), text)

    def test_long_resume_is_truncated(self):
        text = "A" * 5000
        result = app.prepare_resume_text(text)
        self.assertLessEqual(len(result), 3200)
        self.assertTrue(result.endswith("..."))

    def test_job_keywords_are_preserved_when_trimming(self):
        text = (
            "Experienced in product management, stakeholder communication, and leadership. "
            "This is filler text repeated many times to force truncation. " * 40
            + "Python developer with React experience and SQL expertise."
        )
        result = app.prepare_resume_text(text, max_chars=140, job_description="Python React SQL")
        self.assertLessEqual(len(result), 160)
        self.assertIn("Python", result)
        self.assertIn("React", result)


if __name__ == "__main__":
    unittest.main()
